
import { Routes, Route, Link ,Navigate} from "react-router-dom";

import Login from "./Components/Manage/Auth/Login";
import Register from "./Components/Manage/Auth/Register";
import MasterLayout from "./Layout/Manage/MasterLayout";
import MasterLayoutUI from "./Layout/User/MasterLayout";
import Dashboard  from "./Components/Manage/Webpage/Dashboard";
import Profile from "./Components/Manage/Webpage/Profile";
import axios  from "axios";
import AddCategory from "./Components/Manage/Webpage/AddCategory";
axios.defaults.baseURL = 'http://localhost:2105/';
axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.post ['Accept'] = 'application / json';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

// axios.defaults.withCredentials = true; // bật cái đầu buồi này lên sẽ bị Cors : localhost:3000 sẽ k gửi request lên localhost:2105 được
// axios.interceptors.request.use( function(config){
//     const token = localStorage.getItem('auth_token');
//     config.headers.Authorization = token ? `Bearer ${token}` : '';
//     return config;
// });

function App() {
    return (
        <div className="App">
        <Routes>
            {/* <Route path="/" element={<Home/>} /> */}
            <Route path="/" element={<MasterLayoutUI/>} />
            <Route path="/admin/login" element = {<Login/>} />
            <Route path="/admin/register" element = {<Register/>} />
            <Route path="/admin" element = {<MasterLayout/>} >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile/>} />
                <Route path="add-category" element={<AddCategory/>} />
                
            </Route>
        </Routes>
        </div>
    );
}

export default App;
