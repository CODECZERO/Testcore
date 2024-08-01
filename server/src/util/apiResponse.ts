class ApiResponse{
    statusCode:number;
    data:any;
    message:string="Successfull";
    success:boolean;
    constructor(statusCode:number=200,data:unknown=null,message:string="Successfull"){
        this.statusCode=statusCode,
        this.data=data,
        this.message=message,
        this.success=statusCode<400;

    }
}

export {ApiResponse}