import GlobalAlertModal from "../GlobalAlertModal/GlobalAlertModal";
import globalAlert from "../../components/GlobalAlertModal/GlobalAlertModal.module.css";

export default function UserStatusDialog(props) {
  const isActive = props.selectedUser.status === "active";

  const config = isActive
    ? {
        title: "Confirm Deactivation",
        message: "Are you sure you want to deactivate ",
        buttonText: "Yes, Deactivate",
        buttonGradient: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
        iconType: "warning",
      }
    : {
        title: "Confirm Activation",
        message: "Are you sure you want to activate ",
        buttonText: "Yes, Activate",
        buttonGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        iconType: "success",
      };

  return (
    <>
      {props.showModal && (
        <GlobalAlertModal
          show={props.showModal}
          title={config.title}
          message={
            <>
              Are you sure you want to {isActive ? "deactivate" : "activate"}{" "}
              <strong
                className={
                  isActive ? globalAlert.warningName : globalAlert.successName
                }
              >
                {props.selectedUser?.name}
              </strong>
              ?
            </>
          }
          userName={props.name}
          buttonText={config.buttonText}
          buttonGradient={config.buttonGradient}
          iconType={config.iconType}
          warningText="This action will temporarily disable the user's account and they won't be able to access the system."
          successText="This will activate the user's account and restore uninterrupted system access."
          onCancel={() => {
            props.setConfirmUser(null);
          }}
          onConfirm={() => {
            props.setConfirmUser(null);
            props.handleStatusToggle(props.selectedUser);
          }}
        />
      )}
    </>
  );
}
