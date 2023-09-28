import { Schema, Document, Model, model } from "mongoose";

export interface IContact extends Document{
    name: string;
    email: string;
    message: string;
}

const contactSchema:Schema = new Schema<IContact>({
    name: {type: String, required: true},
    email: {type: String, required: true},
    message: {type: String, required: true}
});

const Contact:Model<IContact> = model<IContact>("Contact", contactSchema);

export default Contact;
