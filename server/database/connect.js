import mongoose, { mongo } from "mongoose";
const connectDB=(url)=>{
    mongoose.set('strictQuery',true)
    mongoose.connect(url)
    .then(()=>console.log('successfully connected'))
    .catch((error)=>{
        console.error('failed to connect with mongo');
      console.error(error)
    })
}
export default connectDB