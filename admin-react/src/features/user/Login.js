import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { APP_LOGO } from '../../constants/assets'
import { loginWithCredentials } from '../../app/auth'
import ErrorText from  '../../components/Typography/ErrorText'
import InputText from '../../components/Input/InputText'

function Login({ onLogin }){
    const navigate = useNavigate()

    const INITIAL_LOGIN_OBJ = {
        password : "",
        emailId : ""
    }

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ)

    const submitForm = async (e) =>{
        e.preventDefault()
        setErrorMessage("")

        if(loginObj.emailId.trim() === "")return setErrorMessage("Email Id is required")
        if(loginObj.password.trim() === "")return setErrorMessage("Password is required")

        try{
            setLoading(true)
            await loginWithCredentials(loginObj)
            onLogin?.()
            navigate('/crm/dashboard', { replace: true })
        }catch(error){
            setErrorMessage(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to login"
            )
        }finally{
            setLoading(false)
        }
    }

    const updateFormValue = ({updateType, value}) => {
        setErrorMessage("")
        setLoginObj({...loginObj, [updateType] : value})
    }

    return(
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className='card-body p-8'>
                    <div className='text-center'>
                        <img
                            src={APP_LOGO}
                            alt="Runamarga"
                            className="mx-auto mb-4 h-20 w-14 object-contain"
                        />
                        <h1 className='text-2xl font-semibold'>Runamarga Loan CRM</h1>
                    </div>

                    <form onSubmit={(e) => submitForm(e)}>

                        <div className="mb-4">

                            <InputText type="email" defaultValue={loginObj.emailId} updateType="emailId" containerStyle="mt-4" labelTitle="Email Id" updateFormValue={updateFormValue}/>

                            <InputText defaultValue={loginObj.password} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue}/>

                        </div>

                        <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                        <button type="submit" disabled={loading} className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
