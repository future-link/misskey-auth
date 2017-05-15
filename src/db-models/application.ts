import * as mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  createdAt: String,
  userId: String,
  name: String,
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
  createdAt: string;
  userId: string;
  name: string;
  description: string;
  callbackURL: string|undefined;
  isPublicClient: boolean;
}

export default mongoose.model<ApplicationDocument>("Application", applicationSchema);
