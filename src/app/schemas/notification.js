import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    mensagem: {
      type: String,
      required: true,
    },
    usuario: {
      type: Number,
      required: true,
    },
    status_lido: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', NotificationSchema);
