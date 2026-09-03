// src/app/init.js
const initializeApp = () => {
    if (
        !process.env.NODE_ENV ||
        process.env.NODE_ENV === 'development'
    ) {
        // dev code
    } else {
        // Prod build code

        // Removing console.log from prod
        console.log = () => {}

        // init analytics here
    }
}

export default initializeApp