import { Router, Request, Response } from 'express';
import UserProfile from '../models/UserProfile';

const router = Router();

router.post('/plantSeed', async (req: Request, res: Response) => {
  const { address, plotNumber } = req.body;
  try {
    const user = await UserProfile.findOne({address});
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.seeds > 0) {
      user.seeds--;
      const emptySlot = plotNumber === 1 ? 'plantTime1' : plotNumber === 2 ? 'plantTime2' : plotNumber === 3 ? 'plantTime3' : null;

      if (emptySlot) {
        user[emptySlot] = Date.now();
        user.farmingXp += 5;
        await user.save();
        return res.status(200).json({user,message:'+5 farming xp'});
      } else {
        return res.status(400).json({ message: 'No empty planting slots available' });
      }
    } else {
      return res.status(400).json({ message: 'No seeds available' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/pickPlant', async (req: Request, res: Response) => {
  const { address, plantNumber} = req.body;
  try {
    const user = await UserProfile.findOne({address});
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if(plantNumber === 1){
        if (user.plantTime1) {
            user.plantTime1 = null;
            user.plants++;
            user.farmingXp += 25;
            await user.save();
            return res.status(200).json({user, message: '+25 farming xp \n +1 plant'});
          } else {
            return res.status(400).json({ message: 'Invalid or empty plant time' });
          }
    } else if(plantNumber === 2){
        if (user.plantTime2) {
            user.plantTime2 = null;
            user.plants++;
            user.farmingXp += 25;
            await user.save();
            return res.status(200).json({user, message: '+25 farming xp \n +1 plant'});
          } else {
            return res.status(400).json({ message: 'Invalid or empty plant time' });
          }
    } if(plantNumber === 3){
        if (user.plantTime3) {
            user.plantTime3 = null;
            user.plants++;
            user.farmingXp += 25;
            await user.save();
            return res.status(200).json({user, message: '+25 farming xp \n +1 plant'});
          } else {
            return res.status(400).json({ message: 'Invalid or empty plant time' });
          }
    }
    
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/crushPlant', async (req: Request, res: Response) => {
  const { address } = req.body;
  try {
    const user = await UserProfile.findOne({address});
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.plants > 0) {
      user.plants--;
      user.powders++;
      user.apothecaryXp += 1;
      await user.save();
      return res.status(200).json({user, message:'+1 apothecary xp \n +1 powder'});
    } else {
      return res.status(400).json({ message: 'No plants to crush' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/mixPotion', async (req: Request, res: Response) => {
  const { address } = req.body;
  try {
    const user = await UserProfile.findOne({address});
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.powders > 0 && user.vials > 0) {
      user.powders--;
      user.vials--;
      user.potions++;
      user.apothecaryXp += 10;
      await user.save();
      return res.status(200).json({user,message:'+10 apothecary xp \n +1 potion'});
    } else {
      return res.status(400).json({ message: 'Not enough powders or vials' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/getUser', async (req: Request, res: Response) => {
    const { address } = req.query; // Fetch address from query parameters
  
    if (typeof address !== 'string') return res.status(400).json({ message: 'Invalid address' });
  
    try {
      // Find user by address
      let user = await UserProfile.findOne({ address });
  
      if (!user) {
        // If user does not exist, create a new user with 1000 seeds and 2000 vials
        user = new UserProfile({
          address,
          seeds: 1000,
          vials: 2000,
        });
        await user.save();
      }
  
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });
  

export default router;