import * as mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  name: String,
  userId: String,
  secret: String,
  createdAt: String,
  description: {
    type: String,
    default: "",
  },
  callbackURL: {
    type: String,
    required: false,
  },
  clientType: {
    type: String,
    default: "public",
  },
});

export interface ApplicationDocument extends mongoose.Document {
  _id: string;
  name: string;
  userId: string;
  secret: string;
  createdAt: string;
  description: string;
  callbackURL: string|undefined;
  clientType: ClientType;
}

export type ClientType = "public"|"confidential";

export default mongoose.model<ApplicationDocument>("Application", applicationSchema);
