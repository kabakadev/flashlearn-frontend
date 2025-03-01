import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Container, Card, CardContent, Typography, Button, Link, Box, Alert, TextField } from "@mui/material";
import { motion } from "framer-motion";
import ThemeToggle from "../ThemeComponents/ThemeToggle";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Min 6 characters").required("Required"),
});

const Login = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Box sx={{ position: "absolute", top: 16, right: 16 }}><ThemeToggle /></Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>Welcome Back</Typography>
            <Typography variant="body1" textAlign="center" color="text.secondary">Sign in to continue learning</Typography>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, setErrors }) => {
                try {
                  if (await login(values.email, values.password)) navigate("/dashboard");
                } catch (error) {
                  setErrors({ general: error.message || "Login failed" });
                }
                setSubmitting(false);
              }}
            >
              {({ isSubmitting, errors }) => (
                <Form>
                  {errors.general && <Alert severity="error" sx={{ mb: 2 }}>{errors.general}</Alert>}
                  <Field as={TextField} fullWidth name="email" label="Email" sx={{ mb: 2 }} />
                  <Field as={TextField} fullWidth name="password" label="Password" type="password" sx={{ mb: 3 }} />
                  <Button component={motion.button} whileHover={{ scale: 1.02 }} fullWidth size="large" variant="contained" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </Button>
                  <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                    Don't have an account? <Link component={RouterLink} to="/signup">Sign up here</Link>
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

export default Login;
