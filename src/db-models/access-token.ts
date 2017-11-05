import * as mongoose from "mongoose";

const accessTokenSchema = new mongoose.Schema({
  userId: String,
  appId: String,
  active: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export interface AccessTokenDocument extends mongoose.Document {
  _id: string;
  userId: string;
  appId: string;
  active: boolean;
  createdAt: Date;
}

export default mongoose.model<AccessTokenDocument>(
  "AccessToken",
  accessTokenSchema
);
