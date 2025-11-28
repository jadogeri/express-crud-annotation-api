    import { Response, Request } from "express";
    
    export function notFoundHandler(_req: Request, res: Response) {
    res.status(404).send({
        message: "Not Found",
    });
    }