import axios from "axios"
import apiClient from "./apiClient"

const initializeApp = () => {
    
    // Setting base URL for all API request via axios
    const baseURL = process.env.REACT_APP_BASE_URL || ""

    axios.defaults.baseURL = baseURL
    apiClient.defaults.baseURL = baseURL


    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        // dev code



    } else {
        // Prod build code



        // Removing console.log from prod
        console.log = () => {};


        // init analytics here
    }

}

export default initializeApp
