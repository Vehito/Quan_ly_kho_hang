class ErrorAlert extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode,
        this.message = message
    }

    showAlert() {
        window.alert(`Status code: ${this.statusCode}\n${this.message}`);
    }
}

export default ErrorAlert;