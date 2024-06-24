import React, { useState } from "react";
import { Button } from "antd";
import {
  PhoneOutlined,
  AudioOutlined,
  AudioMutedOutlined,
} from "@ant-design/icons";
import io from "socket.io-client";

const socket = io("https://localhost:4000");

const CallComponent = () => {
  const [micOn, setMicOn] = useState(true);
  const [calling, setCalling] = useState(false);

  const handleCall = () => {
    setCalling(true);
    socket.emit("call", { caller: "user1", recipient: "user2" });
  };

  const handleToggleMic = () => {
    setMicOn((prevMicState) => !prevMicState);
    socket.emit("toggleMic");
  };

  const handleEndCall = () => {
    setCalling(false);
    socket.emit("endCall");
  };

  return (
    <div>
      <Button icon={<PhoneOutlined />} onClick={handleCall} disabled={calling}>
        Call
      </Button>
      {calling && (
        <>
          <Button
            icon={micOn ? <AudioOutlined /> : <AudioMutedOutlined />}
            onClick={handleToggleMic}
          >
            {micOn ? "Mute" : "Unmute"} Mic
          </Button>
          <Button onClick={handleEndCall}>End Call</Button>
        </>
      )}
    </div>
  );
};

export default CallComponent;
