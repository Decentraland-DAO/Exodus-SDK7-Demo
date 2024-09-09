
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'

import { apiManager } from './apiManager'
import { setTimeout } from './utils';
7
export async function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent);

  const data = await apiManager.getUser();
  syncUIState(data);
}




export const UIState: {[key: string]: any} = {
  plants: 0,
  seeds: 0,
  powders: 0,
  vials: 0,
  potions: 0,
  farmingXp: 0,
  apothecaryXp: 0,
  plantTime1: null,
  plantTime2: null,
  plantTime3: null,
}

export const syncUIState = (updatedState: {[key: string]: any}): void => {
  Object.keys(UIState).forEach((key: string) => {
    if(Object.keys(updatedState).includes(key)){
      UIState[key] = updatedState[key];
    }
  });

}

let playerNotification = ''

export const showPlayerNotification = (notification: string = ''): void => {
  playerNotification = notification;
  setTimeout(6000,()=>{
    if(playerNotification){
      playerNotification = ''
    }
  })
} 


const uiComponent = () => (
  <UiEntity>
    <UiEntity
      uiTransform={{
        width: 400,
        height: 400,
        margin: '16px 0 8px 270px',
        padding: 4,
      }}
      uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0.6) }}
    >
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
        uiBackground={{ color: Color4.fromHexString("#70ac76ff") }}
      >
        <UiEntity
          uiTransform={{
            width: '100%',
            height: 50,
            margin: '8px 0'
          }}
          uiBackground={{
            textureMode: 'center',
            texture: {
              src: 'images/scene-thumbnail.png',
            },
          }}
          uiText={{ value: 'Farming + Potions Demo', fontSize: 18 }}
        />
        <Button
          uiTransform={{ width: 100, height: 40, margin: 8, positionType: "absolute", position: {"bottom":"2%", left: "5%"} }}
          value='Crush Plants'
          variant='primary'
          fontSize={14}
          onMouseDown={async() => {
            const response = await apiManager.crushPlant();
            if(response){
              showPlayerNotification(response.message);
              syncUIState(response.user);
            }
            
          }}
        />

        <Button
          uiTransform={{ width: 100, height: 40, margin: 8, positionType: "absolute", position: {"bottom":"2%", left: "35%"}  }}
          value='Mix Potions'
          variant='primary'
          fontSize={14}
          onMouseDown={async() => {
            const response = await apiManager.mixPotion();
            if(response){
              showPlayerNotification(response.message);
              syncUIState(response.user);
            }
          }}
        />
        
        <UiEntity
        uiTransform={{
          width: '25%',
          height: "10%",
          positionType: "absolute",
          position: { left: "2%", top:"10%"}
        }}
        uiText={{value: "Inventory", fontSize: 12,textAlign:'top-left'}}
        
        >
        </UiEntity>

        <UiEntity
        uiTransform={{
          width: '10%',
          height: "10%",
          positionType: "absolute",
          position: { left: "2%", top:"20%"}
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: {
            src: 'images/Plant_150x150.png',
          },
        }}
        >
          <Label
            value={`Plants: ${UIState.plants}`}
            fontSize={14}
            uiTransform={{
              positionType: 'absolute',
              position: {left: "110%", top:"10%"}
            }}
          />
        </UiEntity>
        
        <UiEntity
        uiTransform={{
          width: '10%',
          height: "10%",
          positionType: "absolute",
          position: { left: "2%", top:"31%"}
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: {
            src: 'images/Plant_150x150_1.png',
          },
        }}
        >
          <Label
            value={`Seeds: ${UIState.seeds}`}
            fontSize={14}
            uiTransform={{
              positionType: 'absolute',
              position: {left: "110%", top:"10%"}
            }}
          />
        </UiEntity>

        <UiEntity
        uiTransform={{
          width: '10%',
          height: "10%",
          positionType: "absolute",
          position: { left: "2%", top:"42%"}
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: {
            src: 'images/Plant_Powder_150x150.png',
          },
        }}
        >
          <Label
            value={`Powder: ${UIState.powders}`}
            fontSize={14}
            uiTransform={{
              positionType: 'absolute',
              position: {left: "110%", top:"10%"}
            }}
          />
        </UiEntity>
        
        <UiEntity
        uiTransform={{
          width: '10%',
          height: "10%",
          positionType: "absolute",
          position: { left: "2%", top:"53%"}
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: {
            src: 'images/Empty_Vial_150x150.png',
          },
        }}
        >
          <Label
            value={`Vials: ${UIState.vials}`}
            fontSize={14}
            uiTransform={{
              positionType: 'absolute',
              position: {left: "110%", top:"10%"}
            }}
          />
        </UiEntity>

        <UiEntity
        uiTransform={{
          width: '10%',
          height: "10%",
          positionType: "absolute",
          position: { left: "2%", top:"64%"}
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: {
            src: 'images/Vial_of_water_150x150.png',
          },
        }}
        >
          <Label
            value={`Potions: ${UIState.potions}`}
            fontSize={14}
            uiTransform={{
              positionType: 'absolute',
              position: {left: "110%", top:"10%"}
            }}
          />
        </UiEntity>


      </UiEntity>

      <UiEntity
        uiTransform={{
          width: '35%',
          height: "10%",
          positionType: "absolute",
          position: { right: "25%", top:"20%"}
        }}
        uiText={{value: `Farming Xp: ${UIState.farmingXp}`, fontSize: 12,textAlign:'top-left'}}
        
        >
        </UiEntity>
        <UiEntity
        uiTransform={{
          width: '35%',
          height: "10%",
          positionType: "absolute",
          position: { right: "25%", top:"30%"}
        }}
        uiText={{value: `Apothecary Xp: ${UIState.apothecaryXp}`, fontSize: 12,textAlign:'top-left'}}
        
        >
        </UiEntity>

    </UiEntity>

    <UiEntity
        uiTransform={{
          width: '50%',
          height: "10%",
          positionType: "absolute",
          position: { left: "50%", top:"50%"}
        }}
        uiText={{value: playerNotification, fontSize: 24,textAlign:'top-left'}}
        
    >
    </UiEntity>

  </UiEntity>
  
)



