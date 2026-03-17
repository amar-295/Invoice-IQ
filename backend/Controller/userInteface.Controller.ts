import type { Request, Response } from 'express'; 

export const dashboardDataController = async (req: Request, res: Response) : Promise<Response> => {
    try{
        

    }
    catch(e){
        console.error("Error fetching dashboard data:", e);
        return res.status(500).json({ error: "An error occurred while fetching dashboard data." });
    }
}