const mobileBrowserLocationStep = [
    "Open the browser app (e.g., Chrome, Safari) on your mobile device.",
    "Tap on the three dots ( ⋮ ) or menu icon in the top-right or bottom-right corner of the browser.",
    "Select 'Settings' from the dropdown menu.",
    "Scroll down and tap on 'Site Settings' under the 'Privacy and security' section.",
    "In 'Site Settings', tap on 'Location'.",
    "Ensure the toggle for 'Ask before accessing (recommended)' is enabled (set to 'On').",
    "Look under the 'Blocked' section for the website you want to allow location access to, and tap on it.",
    "Tap on 'Location' under the permissions, then select 'Allow'.",
    "Refresh the website to apply the changes.",
  ];
  
  
  const mobileBrowserCameraStep = [
    "Open the browser app (e.g., Chrome, Safari) on your mobile device.",
    "Tap on the three dots ( ⋮ ) or menu icon in the top-right or bottom-right corner of the browser.",
    "Select 'Settings' from the dropdown menu.",
    "Scroll down and tap on 'Site Settings' under the 'Privacy and security' section.",
    "In 'Site Settings', tap on 'Camera'.",
    "Ensure the toggle for 'Ask before accessing (recommended)' is enabled (set to 'On').",
    "Look under the 'Blocked' section for the website you want to allow camera access to, and tap on it.",
    "Tap on 'Camera' under the permissions, then select 'Allow'.",
    "Refresh the website to apply the changes.",
  ];
  
  
  const desktopBrowserLocationStep = [
    "Open the browser (e.g., Chrome, Firefox, Edge) on your laptop or desktop.",
    "Click on the three dots ( ⋮ ) or menu icon in the top-right corner of the browser.",
    "Select 'Settings' from the dropdown menu.",
    "Click on 'Privacy and security' from the left-hand side menu.",
    "In the 'Privacy and security' section, click on 'Site Settings'.",
    "Scroll down and click on 'Location' under the 'Permissions' section.",
    "Ensure that 'Ask before accessing (recommended)' is selected (toggle it to 'On').",
    "Look under the 'Blocked' section for the website you want to allow location access to, and click on it.",
    "Click on 'Location' under the permissions and select 'Allow'.",
    "Reload the website to apply the changes.",
  ];
  
  
  const desktopBrowserCameraStep = [
    "Open the browser (e.g., Chrome, Firefox, Edge) on your laptop or desktop.",
    "Click on the three dots ( ⋮ ) or menu icon in the top-right corner of the browser.",
    "Select 'Settings' from the dropdown menu.",
    "Click on 'Privacy and security' from the left-hand side menu.",
    "In the 'Privacy and security' section, click on 'Site Settings'.",
    "Scroll down and click on 'Camera' under the 'Permissions' section.",
    "Ensure that 'Ask before accessing (recommended)' is selected (toggle it to 'On').",
    "Look under the 'Blocked' section for the website you want to allow camera access to, and click on it.",
    "Click on 'Camera' under the permissions and select 'Allow'.",
    "Reload the website to apply the changes.",
  ];
  
  const desktopBrowserNotificationStep = [
    "Click the 🔒 lock icon next to the address bar.",
    "Click Site settings.",
    "Find Notifications and select Allow."
  ];

  const desktopNotificationStep=[
    "Open Settings.",
    "Inside Settings, go to System.",
    "In the Right sidebar, click on Notifications.",
    "Find your browser name (like Google Chrome, Microsoft Edge, or Firefox).",
    "Click on the browser and make sure the notifications toggle is turned ON."
  ]
  
  const newUpdateNotification ={
    features: [
      {icon :"➕",text:"Now you can also add subtasks directly from the Task Description window. Based on your task requirements, this will help you create subtasks in parallel more efficiently."},
      {icon:"🔍",text:"Once your task requirements are completed, you need to mark the task as 'Ready to Test'. On button click, a notification will be sent to your project manager indicating that the task requirements are complete."},
      {icon: "🚀", text: "Enhanced performance with 50% faster loading", color: "text-success" },
      { icon: "🎨", text: "Improved user interface design", color: "text-warning" },
      { icon: "🛡️", text: "Bug fixes and security improvements", color: "text-danger" }
    ],
    releaseDate: "22 May, 2025",
  }

  // Note :  Update Version Every Time by +1 when new update is go to live 

  export const CURRENT_VERSION = "v1";

  
  // Export or use the steps wherever needed in your application
  
  export {
    mobileBrowserLocationStep,
    mobileBrowserCameraStep,
    desktopBrowserLocationStep,
    desktopBrowserCameraStep,
    desktopBrowserNotificationStep,
    desktopNotificationStep,
    newUpdateNotification
  };
  