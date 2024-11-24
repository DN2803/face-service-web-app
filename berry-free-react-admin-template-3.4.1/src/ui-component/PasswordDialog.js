import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const PasswordDialog = ({ open, onClose }) => {
    const [password, setPassword] = useState("");

    const handleConfirm = () => {
        onClose(password); // Gửi mật khẩu khi người dùng nhấn "Confirm"
    };

    const handleCancel = () => {
        onClose(null); // Hủy bỏ nhập mật khẩu
    };

    return (
        <Dialog open={open} onClose={handleCancel}>
            <DialogTitle>Session Expired</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Enter your password"
                    type="password" // Ẩn mật khẩu khi nhập
                    fullWidth
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleConfirm} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PasswordDialog;
