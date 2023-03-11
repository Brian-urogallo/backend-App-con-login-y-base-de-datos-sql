import express, { Application } from "express";
import routesProduct from '../routes/product';
import routesUser from '../routes/user';
import cors from "cors";
import { Product } from "./product";
import { User } from "./user";



class Server {
    private app: Application;
    private port: string;

    constructor(){

      this.app = express();
      this.port = process.env.PORT || '3001';
      this.listen();
      this.midlerWares();
      this.routes();
      this.dbConnect();
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log('aplicacion corriendo el puerto ' +this.port)
        })
    }

    routes(){
        this.app.use('/api/products', routesProduct);
        this.app.use('/api/users', routesUser);
    }

    midlerWares(){
        //parseo body
        this.app.use(express.json());
     
        //cors
        this.app.use(cors());
    }

    async dbConnect(){
        try{
            await Product.sync();
            await User.sync();
            
        } catch (error) {
            console.log('no se puede conectar', error)
        }

    }
}
export default Server;