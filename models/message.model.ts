import { Schema, models, model, Document, Model } from "mongoose";

export interface IMessage extends Document {
  content: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  content: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});

export const Message =
  models.Message as Model<IMessage> || model<IMessage>("Message", messageSchema);
