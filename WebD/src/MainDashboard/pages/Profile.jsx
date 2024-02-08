import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useAuth0 } from "@auth0/auth0-react";
import { coversvg } from "../../assets";
import Loading from "../../components/Loading";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const styles = {
	details: {
		padding: "1em",
		borderTop: "1px solid #e1e1e1",
	},
	value: {
		padding: "1rem 2rem",
		borderTop: "1px solid #e1e1e1",
		color: "#899499",
	},
	closeButton: {
		position: "absolute",
		top: "10px",
		right: "10px",
		color: "white",
	},
};

const Profile = () => {
	const { user, isLoading } = useAuth0();
	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [apiKey, setApiKey] = useState(null);
	const [apiSecret, setApiSecret] = useState(null);

	useEffect(() => {
		const fetchUserKeys = async () => {
			if (!isLoading && user && user.email) {
				try {
					const response = await fetch(
						`https://tensorforce-backend.onrender.com/api/keys/${user.email}`
					);
					const data = await response.json();
					if (data.success) {
						setApiKey(data.apiKey || null);
						setApiSecret(data.apiSecretKey || null);
					} else {
						console.error(
							"Failed to fetch user keys:",
							data.message
						);
					}
				} catch (error) {
					console.error("Error fetching user keys:", error);
				}
			}
		};

		fetchUserKeys();
	}, [isLoading, user]);

	const handleUpdateButtonClick = () => {
		setShowUpdateForm(true);
	};

	const handleCloseForm = () => {
		setShowUpdateForm(false);
	};

	const handleSaveChanges = async () => {
		try {
			const response = await fetch(
				"https://tensorforce-backend.onrender.com/api/updateKeys",
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: user.email,
						apiKey,
						apiSecretKey: apiSecret,
					}),
				}
			);
			const data = await response.json();
			if (data.success) {
				toast.success("Changes saved successfully!");
				setShowUpdateForm(false);
			} else {
				toast.error("Failed to save changes. Please try again.");
			}
		} catch (error) {
			console.error("Error updating keys:", error);
			toast.error("An error occurred while saving changes.");
		}
	};

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
				alignItems: "center",
			}}
		>
			<ToastContainer />
			<img
				alt="avatar"
				src={coversvg}
				style={{
					filter:
						"invert(11%) sepia(9%) saturate(2458%) hue-rotate(172deg) brightness(98%) contrast(89%)",
					width: "100%",
					height: "35vh",
					objectFit: "cover",
					objectPosition: "50% 50%",
				}}
			/>
			<Grid
				container
				direction={{ xs: "column", md: "row" }}
				spacing={4}
				justifyContent="center"
				alignItems="center"
				style={{
					position: "relative",
					marginTop: "-30vh",
				}}
			>
				<Grid
					item
					xs={12}
					md={6}
					justifyContent="center"
					alignItems="center"
				>
					<Card
						variant="outlined"
						sx={{ borderColor: "white", borderRadius: "10px" }}
					>
						<Grid
							container
							direction="column"
							alignItems="center"
							style={{
								color: "white",
								backgroundColor: "#20232a",
								borderRadius: "10px",
							}}
						>
							<Grid
								item
								sx={{ p: "1.5rem 0rem", textAlign: "center" }}
							>
								<Badge
									overlap="circular"
									anchorOrigin={{
										vertical: "bottom",
										horizontal: "left",
									}}
								>
									<Avatar
										sx={{ width: 100, height: 100, mb: 1.5 }}
										src={user.picture}
										referrerPolicy="no-referrer"
									/>
								</Badge>
								<Typography variant="h6">{user.name}</Typography>
								<Typography color="white">Client</Typography>
							</Grid>
							<Grid container>
								<Grid item xs={6}>
									<Typography style={styles.details}>
										Email
									</Typography>
									<Typography style={styles.details}>
										API KEY
									</Typography>
									<Typography style={styles.details}>
										API SECRET
									</Typography>
								</Grid>
								<Grid item xs={6} sx={{ textAlign: "end" }}>
									<Typography style={styles.value}>
										{user.email}
									</Typography>
									<Typography style={styles.value}>
										{apiKey === null ? "null" : apiKey}
									</Typography>
									<Typography style={styles.value}>
										{apiSecret === null ? "null" : apiSecret}
									</Typography>
								</Grid>
							</Grid>
							<Grid
								item
								style={styles.details}
								sx={{ width: "100%" }}
							>
								<Button
									variant="contained"
									onClick={handleUpdateButtonClick}
									sx={{
										width: "100%",
										p: 1,
										my: 2,
										backgroundColor: "#00c9d7",
										borderRadius: "10px",
									}}
								>
									Update Profile
								</Button>
							</Grid>
						</Grid>
					</Card>
				</Grid>

				{showUpdateForm && (
					<Grid
						item
						xs={12}
						md={4}
						justifyContent="center"
						alignItems="center"
					>
						<Card
							variant="outlined"
							sx={{
								borderColor: "white",
								borderRadius: "10px",
								position: "relative",
							}}
						>
							<IconButton
								aria-label="close"
								sx={styles.closeButton}
								onClick={handleCloseForm}
							>
								<CloseIcon />
							</IconButton>
							<Grid
								container
								direction="column"
								alignItems="center"
								style={{
									color: "white",
									backgroundColor: "#20232a",
									padding: "1em",
									borderRadius: "10px",
								}}
							>
								<Typography
									variant="h6"
									style={{ marginBottom: "1em" }}
								>
									Update Profile
								</Typography>
								<label
									htmlFor="apiKey"
									style={{
										marginBottom: "0.5em",
										textAlign: "left",
										width: "100%",
									}}
								>
									API Key
								</label>
								<input
									id="apiKey"
									type="text"
									style={{
										backgroundColor: "#20232a",
										color: "white",
										marginBottom: "1em",
										width: "100%",
										padding: "0.5em",
										borderRadius: "5px",
										border: "1px solid #ffffff",
										boxSizing: "border-box",
									}}
									value={apiKey === null ? "null" : apiKey}
									onChange={(e) => setApiKey(e.target.value)}
								/>
								<label
									htmlFor="apiSecret"
									style={{
										marginBottom: "0.5em",
										textAlign: "left",
										width: "100%",
									}}
								>
									API Secret
								</label>

								<input
									id="apiSecret"
									type="password"
									style={{
										backgroundColor: "#20232a",
										color: "white",
										marginBottom: "1em",
										width: "100%",
										padding: "0.5em",
										borderRadius: "5px",
										border: "1px solid #ffffff",
										boxSizing: "border-box",
									}}
									value={apiSecret === null ? "null" : apiSecret}
									onChange={(e) => setApiSecret(e.target.value)}
								/>
								<Grid
									item
									xs={12}
									style={{ width: "85%", marginBottom: "1em" }}
								>
									<button
										style={{
											color: "white",
											backgroundColor: "#00c9d7",
											borderRadius: "10px",
											width: "100%",
											padding: "0.5em",
											border: "none",
										}}
										onClick={handleSaveChanges}
									>
										Save Changes
									</button>
								</Grid>
							</Grid>
						</Card>
					</Grid>
				)}
			</Grid>
		</div>
	);
};

export default Profile;
