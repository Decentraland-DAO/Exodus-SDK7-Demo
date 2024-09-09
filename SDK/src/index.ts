import { Vector3 } from '@dcl/sdk/math'
import { setupUi } from './ui'
import { FarmingNode } from './farmingPlot'
import { apiManager } from './apiManager'

export async function main() {


  // draw UI. 
  apiManager.setPlayer();
  
  setupUi()

  new FarmingNode({position: Vector3.create(3,0,5), scale: Vector3.create(2,1,2)},1)
  new FarmingNode({position: Vector3.create(3,0,8), scale: Vector3.create(2,1,2)},2)
  new FarmingNode({position: Vector3.create(3,0,11), scale: Vector3.create(2,1,2)},3)
  
}
