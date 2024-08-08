class ApiError extends Error{
    statusCode:number;
    data:any;
    success:boolean;
    errors:unknown[];
    

    constructor(
        statusCode:number=500,
        message:any="something went wrong",
        errors:unknown[]=[],
        stack:string=""
    ){
        super(message);
        this.statusCode=statusCode;
        this.data=message;
        this.message=message?message:null;
        this.success=false;
        this.errors=errors;
        stack?this.stack=stack:Error.captureStackTrace(this,this.constructor);
    }
}

export {ApiError};