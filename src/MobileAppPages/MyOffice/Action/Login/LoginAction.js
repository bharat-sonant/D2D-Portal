export const validateForm = (formData, setErrors) => {
    const newErrors = {};

    if (!formData.empCode.trim()) {
        newErrors.empCode = 'Employee code is required';
    }

    if (!formData.password.trim()) {
        newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

export const handleChange = (e, setFormData, setErrors) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    setErrors(prev => ({ ...prev, [name]: '' }));
};

export const handleSubmit = (e, setIsLoading, formData, setErrors, navigate) => {
    e.preventDefault();

    if (!validateForm(formData, setErrors)) return;

    setIsLoading(true);

    setTimeout(() => {
        setIsLoading(false);
        navigate('/MyOfficeDashboard');
    }, 1500);
};

export const validateForgotEmpCode = (forgotEmpCode, setForgotError) => {
    if (!forgotEmpCode.trim()) {
        setForgotError('Employee code is required');
        return false;
    }

    if (forgotEmpCode.trim().length < 3) {
        setForgotError('Employee code must be at least 3 characters');
        return false;
    }

    setForgotError('');
    return true;
};

export const onForgotSubmit = (forgotEmpCode, setForgotError) => {
    if (!validateForgotEmpCode(forgotEmpCode, setForgotError)) return;
}
