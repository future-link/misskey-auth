import * as mongoose from "mongoose";

const accessTokenSchema = new mongoose.Schema({
  userId: String,
  appId: String,
  active: Boolean,
  createdAt: String
});

export interface AccessTokenDocument extends mongoose.Document {
  _id: string;
  userId: string;
  appId: string;
  active: boolean;
  createdAt: string;
}

export default mongoose.model<AccessTokenDocument>(
  "AccessToken",
  accessTokenSchema
);
