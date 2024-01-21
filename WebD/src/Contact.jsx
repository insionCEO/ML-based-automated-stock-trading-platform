import React, { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./style";
import emailjs from "@emailjs/browser";
import { Navbar, Button, Footer } from "./components";

const Result = () => {
	return <p>Your message has been successfully sent.</p>;
};

const Contact = () => {
	const [result, showResult] = useState(false);
	const form = useRef();

	const showToast = () => {
		toast.success("Sent Email Successfully");
	};

	const sendEmail = async (e) => {
		e.preventDefault();

		const formData = new FormData(form.current);
		const name = formData.get("user_name");
		const email = formData.get("user_email");
		const message = formData.get("message");

		emailjs
			.sendForm("service_2ple5xi", "template_v7tyw6i", form.current, "RRDZn2aOJpp7EsaMm")
			.then((result) => {
				console.log(result.text);

				showResult(true);

				setTimeout(() => {
					showResult(false);
				}, 5000);
			})
			.catch((error) => {
				console.log(error.text);
			});
	};

	return (
		<form ref={form} onSubmit={sendEmail}>
			<div className="bg-primary w-full overflow-hidden">
				<div className={`${styles.paddingX} ${styles.flexCenter}`}>
					<div className={styles.boxWidth}>
						<Navbar />
					</div>
				</div>

				<div className={`bg-primary ${styles.paddingX} ${styles.flexStart}`}>
					<div className={styles.boxWidth}>
						<section
							className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow`}
						>
							<div className="flex-1 flex flex-col">
								<div
									onSubmit={() => {
										sendEmail().then(() => {
											showToast();
										});
									}}
									className="mt-8 mr-20 flex flex-col"
								>
									<input
										name="fullName"
										type="text"
										placeholder="Name"
										required
										className={`w-96 h-10 py-3 px-4 bg-white font-poppins font-medium text-[18px] text-black outline-none rounded-[10px] mb-4`}
									/>
									{/* <input
                      type="tel"
                      placeholder="Phone Number"
                      required
                      className={`w-96 h-10 py-3 px-4 bg-white font-poppins font-medium text-[18px] text-black outline-none rounded-[10px] mb-4`}
                    /> */}
									<input
										name="email"
										type="email"
										placeholder="Email"
										required
										className={`w-96 h-10 py-3 px-4 bg-white font-poppins font-medium text-[18px] text-black outline-none rounded-[10px] mb-4`}
									/>
									<textarea
										name="message"
										placeholder="Message"
										required
										className={`w-96 h-20 py-3 px-4 bg-white font-poppins font-medium text-[18px] text-black outline-none rounded-[10px] mb-4`}
									/>
									<div className="mt-10">
										<Button
											label="Submit"
											onClick={() => {
												sendEmail().then(() => {
													showToast();
												});
											}}
											className="hover:bg-gray-700 hover:text-white"
										/>
									</div>
								</div>
							</div>
							<div>
								<iframe
									src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Veermata%20Jijabai%20Technological%20Institute%20VJT+(Veermata%20Jijabai%20Technological%20Institute%20VJTI)&amp;t=&amp;z=16&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
									width="600"
									height="450"
									style={{ border: 0 }}
									allowFullScreen=""
									loading="lazy"
								></iframe>
							</div>
						</section>
						<Footer />
					</div>
				</div>
				<div className="row">
					<ToastContainer />
					{result ? <Result /> : null}
				</div>
			</div>
		</form>
	);
};

export default Contact;
