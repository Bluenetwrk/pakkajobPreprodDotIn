import React, { useEffect, useState } from 'react';
import TemplateOne from './TemplateOne';
import TemplateTwo from './TemplateTwo';
import TemplateGallery from './TemplateGallery';
import axios from 'axios';
import styles from "../Jobs/Allobs.module.css"
import Style from "./AllResumes.module.css"
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import TemplateThree from './TemplateThree';
import TemplateFour from './TemplateFour';
import TemplateFive from './TemplateFive';
import TemplateSix from './TemplateSix';
import TemplateSeven from './TemplateSeven';
import ColorThemeSelector from './ColorThemeSelector';
import TemplateEight from './TemplateEight';

  
function AllResumes() {
  // const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [profileData, setProfileData] = useState(null);

  let location = useLocation()
  const { logoutresume } = location.state || {};
  const { selectedTemplate } = location.state || {};
  const { loginprofile } = location.state || {};

  
  // if(loginprofile==="cs_center"){
  //   localStorage.setItem("csprofile", JSON.stringify(loginprofile));
  // }

  // console.log("login profile", loginprofile)


  const [themeColor, setThemeColor] = useState("#2563eb");

   const navigate = useNavigate()
  return (
<>

    <div>
      {/* {console.log("st",selectedTemplate)} */}
      {!selectedTemplate?
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Choose resume template<br></br> </h1>
       :
       <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Preview Your Resume </h1>}
      {!selectedTemplate && (
        <TemplateGallery logoutresume={logoutresume} loginprofile={loginprofile}/>
      )}

      {selectedTemplate && profileData && (
        <div style={{ padding: '20px' }}>
          <div style={{display:"flex", justifyContent:"space-between",marginBottom:"5px"}}>
            <div>
          <button
  class={Style.jobdetailBackBtnContainer }
  onClick={() => {
     // First reset the template view
    
  }}
>
  <div class={Style.backbtn} 
  onClick={() => {
    if (window.history.length > 1) {
       navigate(-1);
      } else {
         navigate('/resumes'); 
       }
  }}
  >Back</div>
</button>

<button
  class={Style.jobdetailBackBtnContainer }
  onClick={() => {navigate("/Update-Profile")}}
>
  <div class={Style.updatebtn}>Update Profile</div>
</button>
</div>

<div style={{marginLeft:"-6%"}}>
    <ColorThemeSelector
        selected={themeColor}
        onChange={setThemeColor}
      />
  </div>
  <div></div>
 
</div>
{/* {console.log("selected template",themeColor)} */}
          {selectedTemplate === 'one' && <TemplateOne data={profileData} themeColor={themeColor} />}
          {selectedTemplate === 'two' && <TemplateTwo data={profileData} themeColor={themeColor}/>}
          {selectedTemplate === 'three' && <TemplateThree data={profileData} themeColor={themeColor} />}
          {selectedTemplate === 'four' && <TemplateFour data={profileData} themeColor={themeColor} />}
          {selectedTemplate === 'five' && <TemplateFive data={profileData} themeColor={themeColor} />}
          {selectedTemplate === 'six' && <TemplateSix data={profileData} themeColor={themeColor} />}
          {selectedTemplate === 'seven' && <TemplateSeven data={profileData} themeColor={themeColor}/>}
          {selectedTemplate === 'eight' && <TemplateEight data={profileData} themeColor={themeColor}/>}
        </div>
        
      )}
    </div>
    </>
  );
}

export default AllResumes;


