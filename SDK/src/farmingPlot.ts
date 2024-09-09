
import { Entity,Animator, GltfContainer,PBAnimationState,InputAction, MeshCollider, MeshRenderer, Transform, TransformTypeWithOptionals, engine, pointerEventsSystem, PointerEvents, Material, Tween, EasingFunction } from "@dcl/sdk/ecs";

import { Quaternion, Vector3, Color3, Color4 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { apiManager } from "./apiManager";
import { showPlayerNotification, syncUIState, UIState } from "./ui";
import { sleep } from "./utils";


 
export class FarmingNode
{


    
    patchEntity: Entity = engine.addEntity(); 
    plantEntity: Entity = engine.addEntity();

    planted: boolean = false;
    plantName: string = '';

    plantSpawned: boolean = false;
  
  
    timeRemaining: number = -1;

    active: boolean; //if the node is being actively used
    playerInPosition: boolean; //if the player is within the trigger distance 
    triggerDistance: number; //distance minimum to be able to trigger and use the node

    transform: TransformTypeWithOptionals; //standard transform args

    hoverText: string = 'Plant Seeds';//appears when hovering mouse over node
    looping: boolean = false;
    updateTickId: number = 0;

    nodeId: number;
    colliderEntity: Entity;

    constructor(transform: TransformTypeWithOptionals, nodeId: number)
    {

        this.transform = transform;
        this.active = false;
        this.playerInPosition = false;
        this.triggerDistance = 10;
        this.hoverText = 'Plant Seeds'

        this.nodeId = nodeId;

        Transform.create(this.patchEntity, transform)
        Transform.create(this.plantEntity, {position: Vector3.create(transform.position?.x, (transform.position?.y || 0) + 0.5, transform.position?.z), scale: Vector3.create(.01,.01,.01)})
    
        MeshRenderer.setBox(this.patchEntity)
        MeshCollider.setBox(this.patchEntity)
        Material.setPbrMaterial(this.patchEntity, { albedoColor: Color4.fromHexString("#964B00") })
      
        utils.triggers.addTrigger(
            this.patchEntity,
            utils.NO_LAYERS, 
            utils.LAYER_1,
            [{
                type: "box",
                position: Vector3.Zero(),
                scale: Vector3.create(this.triggerDistance,this.triggerDistance,this.triggerDistance) 
            }],
            () => {
                console.log('ENTERING FARMING TRIGGER BOX');
                        this.playerInPosition = true;
                        this.looping = true;
                        this.updateTick();
                        this.updatePatch();
            }, 
            () => {
                console.log('EXITING FARMING TRIGGER BOX');
                this.playerInPosition = false;
                this.handleExit();
            },Color3.Black()
        )


        pointerEventsSystem.onPointerDown(
            {
            entity: this.patchEntity,
            opts: { 
                button: InputAction.IA_POINTER,
                hoverText: this.hoverText,
                maxDistance: 5
                },
            }, () => {
                this.clickHandler()
            }
        )
        
        const colliderEntity = engine.addEntity();
        MeshCollider.setBox(colliderEntity)

        Transform.create(colliderEntity, {
            position: Vector3.create(0, 0, 0),
            rotation: Quaternion.fromEulerDegrees(180, 0, 0),
            scale: Vector3.create(1, 1, 1),
            parent: this.patchEntity
        })

        pointerEventsSystem.onPointerDown(
            {
            entity: colliderEntity,
            opts: { 
                button: InputAction.IA_POINTER,
                hoverText: this.hoverText,
                maxDistance: 5
                },
            }, () => {
                this.clickHandler()
            }
        )
       
     
        this.colliderEntity = colliderEntity
 
    }

    handleExit = () : void => {
        this.active = false;
        this.looping = false;
       
        
    }

    clickHandler = async() :Promise<void> => {
       await this.updatePatch();

       if (!this.playerInPosition) {
        return;
        }

        if(!this.planted) {
           
           
           const response = await apiManager.plantSeed(this.nodeId);
           if(response){
            syncUIState(response.user);
            this.updatePatch();
            showPlayerNotification(response.message)
           }
        
        } else {
            if(this.timeRemaining > 0) {
                showPlayerNotification(`This plant has ${Math.ceil(this.timeRemaining)} seconds left to grow`)
            } else {
                const response = await apiManager.pickPlant(this.nodeId);
                console.log("Response", response);
                if(response){
                    syncUIState(response.user);
                    this.updatePatch();
                    showPlayerNotification(response.message)
                }
            }
        }

       
    }

    


    updatePatch = async(): Promise<void> => {
        const patchData = {plantTime: UIState[`plantTime${this.nodeId}`]}
        if(!patchData) return;
        

        if(!patchData.plantTime) {
            Transform.getMutable(this.plantEntity).scale = Vector3.create(0.01,0.01,0.01)

            GltfContainer.deleteFrom(this.plantEntity);
            this.plantName = ''
            this.planted = false;
            this.hoverText = 'Plant Seeds'

            const patchOnClick = PointerEvents.getMutable(this.patchEntity);
            if(patchOnClick.pointerEvents?.[0].eventInfo){
                patchOnClick.pointerEvents[0].eventInfo.hoverText = this.hoverText
            }
            const colliderOnClick = PointerEvents.getMutable(this.colliderEntity);
            if(colliderOnClick.pointerEvents?.[0].eventInfo){
                colliderOnClick.pointerEvents[0].eventInfo.hoverText = this.hoverText
            }
            return;
        }

        

        GltfContainer.createOrReplace(this.plantEntity,{src: 'assets/models/Plant.glb'})
        this.planted = true;
        this.hoverText = 'Check Plants'
           
        
        
        const plantedTime = patchData.plantTime;
        const now = Date.now();
        
        const totalGrowthTime = 60.0*5*1000;
        const growthPercentage = (now-plantedTime)/totalGrowthTime;

        if(growthPercentage < 0.25) {
            this.animateSizeChange(0.01);
        }else if(growthPercentage < 0.5) {
            this.animateSizeChange(.02)
        }else if(growthPercentage < 1) {
           this.animateSizeChange(.03);
        } else if(growthPercentage > 1) {
            this.hoverText = 'Pick Plant'
           this.animateSizeChange(.04);
        } else {
            this.animateSizeChange(0.01);
            GltfContainer.deleteFrom(this.plantEntity)
        }

        this.timeRemaining = (1-growthPercentage) * totalGrowthTime / 1000;
        const patchOnClick = PointerEvents.getMutable(this.patchEntity);
        if(patchOnClick.pointerEvents?.[0].eventInfo){
            patchOnClick.pointerEvents[0].eventInfo.hoverText = this.hoverText
        }
        const colliderOnClick = PointerEvents.getMutable(this.colliderEntity);
        if(colliderOnClick.pointerEvents?.[0].eventInfo){
            colliderOnClick.pointerEvents[0].eventInfo.hoverText = this.hoverText
        }
        
    }

    updateTick = async(): Promise<void> => {
        const tickId = Math.floor(100000000000*Math.random());
        this.updateTickId = tickId
        if(!this.looping) return;
        await sleep(30000);
        if(this.updateTickId === tickId) {
            
            
            this.updatePatch();
            this.updateTick();
        }
        
    }

    async animateSizeChange(endScale: number): Promise<void> {
        const startScale = Transform.getMutable(this.plantEntity).scale.x;
        Tween.createOrReplace(this.plantEntity, {
            mode: Tween.Mode.Scale({
              start: Vector3.create(startScale, startScale, startScale),
              end: Vector3.create(endScale,endScale, endScale),
            }),
            duration: 2000,
            easingFunction: EasingFunction.EF_LINEAR,
          })
    }

  

}

