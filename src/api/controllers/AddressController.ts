import { Request, Response } from "express";
import CustomRequest from "../common/CustomRequestInterface";
import Address from "../models/addressModel";

class AddressController {
    //API : /address/getlocation/:sessionId
    //Method : GET
    //Access : Public
    //Description : get user's location
    getLocation = async (req: CustomRequest, res: Response) => {
        const userId = req.userId;
        try {
            const fetchAddress = await Address.findOne(
                {
                    userId: userId
                }
            );
            return res.status(200).json({
                status: true,
                location: fetchAddress
            });
        } catch (error:any) {
            return res.status(500).json({
                status: false,
                message: error?.message,
                error: error?.stack,
            });
        }
    }

    //API : /address/setlocation
    //Method : POST
    //Access : Public
    //Description : set user's location
    setLocation = async (req: CustomRequest, res: Response) => {
        const userId = req.userId;
        try {
            let {
                pincode,
                city,
                state,
                buildingName,
                roadName
            }:{
                pincode: string|undefined;
                city: string|undefined;
                state: string|undefined;
                buildingName: string|undefined;
                roadName: string|undefined;
            } = req.body;
            if(!pincode || !city || !state || !buildingName || !roadName) {
                return res.status(400).json(
                    {
                        status: false,
                        message: "Some fields are missing in payload"
                    }
                );
            }
            // update or insert if doesn't exist
            const info = await Address.updateOne(
                {
                    userId: userId
                },
                {
                    $set: req.body
                },
                {
                    upsert: true
                }
            );
            return res.status(200).json({
                status: true,
                info: info
            });
        } catch (error:any) {
            return res.status(500).json({
                status: false,
                message: error?.message,
                error: error?.stack,
            });
        }
    }
}

export default new AddressController();