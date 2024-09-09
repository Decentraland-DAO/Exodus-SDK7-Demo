import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProfile extends Document {
  plants: number;
  seeds: number;
  powders: number;
  vials: number;
  potions: number;
  farmingXp: number;
  apothecaryXp: number;
  plantTime1: Number | null;
  plantTime2: Number | null;
  plantTime3: Number | null;
  address: string; 

}

const UserProfileSchema: Schema = new Schema({
  plants: { type: Number, default: 0 },
  seeds: { type: Number, default: 0 },
  powders: { type: Number, default: 0 },
  vials: { type: Number, default: 0 },
  potions: { type: Number, default: 0 },
  farmingXp: { type: Number, default: 0 },
  apothecaryXp: { type: Number, default: 0 },
  plantTime1: { type: Number, default: null },
  plantTime2: { type: Number, default: null },
  plantTime3: { type: Number, default: null },
  address: { type: String, default: '' }, 

});

UserProfileSchema.statics.findByAddress = function (address: string) {
    return this.findOne({ address });
  };

const UserProfile = mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);



export default UserProfile;