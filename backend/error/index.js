const handleError = (err,res) => (data) => {
    const { statusCode , message } = err;
    if (data) {
        res.status(statusCode).json({
            status:'Succsess',
            message:message,
            data:data
        })
    } else {
        res.status(statusCode).json({
            status:'error',
            message:message
        })
    }
}
class ErrorHandler extends Error
{
    constructor(statusCode,message)
    {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = {
    ErrorHandler,
    handleError
}