class UniError extends Error{
    data:any;
    success:boolean;
    errors:unknown[];
    

    constructor(
        message:any="something went wrong",
        errors:unknown[]=[],
        stack:string=""
    ){
        super(message);
        this.data=message;
        this.message=message?message:null;
        this.success=false;
        this.errors=errors;
        stack?this.stack=stack:Error.captureStackTrace(this,this.constructor);
    }
}

export {UniError};