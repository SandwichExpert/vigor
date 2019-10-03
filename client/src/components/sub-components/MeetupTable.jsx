import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import moment from "moment";
import UserDisplay from "./UserDisplay";
import clipboardCopy from "clipboard-copy";
import CopyExample from "./CopyToClipBoard";
import { NONAME } from "dns";
export default function MeetupTable(props) {
  const [copySuccess, setCopySuccess] = useState("");
  const textAreaRef = useRef(null);
  const [meetup, setMeetup] = useState({
    name: "",
    meetup_date: "",
    meetup_time: "",
    deleteId: ""
  });
  const [meetups, setMeetups] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  // let EditableTd = contentEditable("td", editingValue);

  const [isAdmin, setIsAdmin] = useState(false);

  function copyToClipBoard(e) {
    // console.log(e);
    // console.log(e.target.tagName);
    window.alert("meetup id copied share with a friend!");
    let elementThatWasClicked = e.target.tagName;
    if (elementThatWasClicked == "I") {
      e.target.parentElement.previousElementSibling.select();
    } else {
      e.target.previousElementSibling.select();
    }
    console.log(e.target.previousElementSibling);
    document.execCommand("copy");
    setCopySuccess("Copied!");
  }

  useEffect(() => {
    setMeetups(props.meetups);
  }, []);

  function dateDisplay(dateString) {
    const date = moment(dateString).format("MMM DD");
    return date;
  }

  function removeUser(meetupId) {
    const userId = props.user._id;

    console.log(props.user._id, meetupId);
    api
      .removeUserFromMeetup(userId, meetupId)
      .then(removedUser => {
        console.log("user Removed");
      })
      .catch(err =>
        console.log(
          err,
          "-----------------------------------------***************************************************************"
        )
      );
  }

  function toggleId(index) {
    if (selectedItem === index) {
      setSelectedItem(null);
    } else setSelectedItem(index);
  }

  let data = {
    name: meetup.name,
    meetup_date: meetup.meetup_date,
    meetup_time: meetup.meetup_time
  };

  // api.editMeetup(data).then(updatedMeetup => {
  //   this.props.history.push("/home");
  // });

  return (
    <table className="meetup-table">
      {/* <pre>{JSON.stringify(meetups,null,2)}</pre> */}
      <thead>
        <tr>
          <th>Name</th>
          <th>Time/Date</th>
          <th>Add User</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {props.meetups.map((meetup, index) => {
          if (props.user._id === meetup._admin && !isAdmin) {
            setIsAdmin(true);
          }
          return (
            <tr key={meetup._id}>
              <td
                className="meetup-name"
                style={{
                  color: `${props.user._id === meetup._admin ? "red" : "black"}`
                }}
              >
                <Link
                  to={`/my-meetup/${meetup._id}`}
                  style={{
                    color: `${
                      props.user._id === meetup._admin ? "red" : "black"
                    }`
                  }}
                >
                  {meetup.name}
                </Link>
              </td>

              <td>
                {meetup.meetup_time} {dateDisplay(meetup.meetup_date)}
              </td>

              <td>
                {/* <CopyExample value={meetup._id} /> */}
                <textarea
                  style={{
                    position: "absolute",
                    zIndex: -10,
                    height: 0,
                    width: 0,
                    border: "none",
                    resize: "none"
                  }}
                  value={meetup._id}
                  readOnly
                />
                <button
                  style={{ border: "none", background: "none" }}
                  _data={meetup._id}
                  onClick={e => copyToClipBoard(e)}
                >
                  <i
                    className="fas fa-plus"
                    style={{
                      color: `${
                        props.user._id === meetup._admin ? "red" : "black"
                      }`
                    }}
                  ></i>
                </button>
                {/* <CopyToClipboard>
                  {({ copy }) => (
                    <button
                      style={{ border: "none", background: "none" }}
                      _data={meetup._id}
                      onClick={() => copy(meetup._id)}
                    >
                      
                    </button>
                  )}
                </CopyToClipboard> */}
              </td>
              {props.user._id === meetup._admin ? (
                <td>
                  <Link to={"/edit-meetup/" + meetup._id}>
                    <i className="fas fa-edit"></i>
                  </Link>
                </td>
              ) : (
                <td>
                  <Link to={"/home/" + props.user._id}>
                    <button
                      onClick={e => {
                        const meetupId = meetup._id;
                        console.log(meetupId);

                        removeUser(meetupId);
                      }}
                      style={{ border: "none", background: "none" }}
                    >
                      <i
                        className="fas fa-user-minus"
                        onClick={e => {
                          const meetupId = meetup._id;
                          console.log(meetupId);
                          removeUser(meetupId);
                        }}
                        style={{ fontSize: "1em", textAlign: "center" }}
                      ></i>
                    </button>
                  </Link>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
