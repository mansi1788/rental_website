import mongoose from "mongoose";

const connectdb = async()=>{
    try{
    const con = await mongoose.connect(process.env.MONGO_URL);
    console.log(`conected to mongodb ${con.connection.host}`);
    }
    catch(error)
    {
        console.log(`error${error}`);
        process.exit(1);
    }

}
export default connectdb;
