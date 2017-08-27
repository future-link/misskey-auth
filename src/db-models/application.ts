import * as mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  name: String,
  userId: String,
  secret: String,
  createdAt: Date,
  description: {
    type: String,
    default: "",
  },
  callbackURL: {
    type: String,
    required: false,
  },
  isPublicClient: {
    type: Boolean,
    default: false,
  },
});

export interface ApplicationDocument extends mongoose.Document {
  _id: string;
  name: string;
  userId: string;
  secret: string;
  createdAt: Date;
  description: string;
  callbackURL: string|undefined;
  isPublicClient: boolean;
}

export default mongoose.model<ApplicationDocument>("Application", applicationSchema);
