module.exports = {
    Request: class Request {
        constructor(address) {
            this.time = new Date().getTime().toString().slice(0, -3),
                this.address = address;
        }
    },
    Response: class Response {
        constructor(address, requestedTimeStamp) {
            this.address = address,
                this.requestedTimeStamp = requestedTimeStamp,
                this.message = address + ":" + requestedTimeStamp + ":" + "starRegistry"
            this.validationWindow = 300;
        }
    }
};