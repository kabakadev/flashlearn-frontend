import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Container, Card, CardContent, Typography, Button, Link, Box, Alert, TextField } from "@mui/material";
import { motion } from "framer-motion";
import ThemeToggle from "../ThemeComponents/ThemeToggle";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  username: Yup.string().min(3, "Min 3 characters").required("Required"),
  password: Yup.string().min(6, "Min 6 characters").required("Required"),
});

const Signup = () => {
  const { signup } = useUser();
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Box sx={{ position: "absolute", top: 16, right: 16 }}><ThemeToggle /></Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>Create Account</Typography>
            <Typography variant="body1" textAlign="center" color="text.secondary">Join FlashLearn and start learning</Typography>
            <Formik
              initialValues={{ email: "", username: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, setErrors }) => {
                try {
                  if (await signup(values.email, values.username, values.password)) navigate("/dashboard");
                } catch (error) {
                  setErrors({ general: error.message || "Signup failed" });
                }
                setSubmitting(false);
              }}
            >
              {({ isSubmitting, errors }) => (
                <Form>
                  {errors.general && <Alert severity="error" sx={{ mb: 2 }}>{errors.general}</Alert>}
                  <Field as={TextField} fullWidth name="email" label="Email" sx={{ mb: 2 }} />
                  <Field as={TextField} fullWidth name="username" label="Username" sx={{ mb: 2 }} />
                  <Field as={TextField} fullWidth name="password" label="Password" type="password" sx={{ mb: 3 }} />
                  <Button component={motion.button} whileHover={{ scale: 1.02 }} fullWidth size="large" variant="contained" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating account..." : "Create account"}
                  </Button>
                  <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                    Already have an account? <Link component={RouterLink} to="/login">Sign in here</Link>
                  </Typography>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Signup;
