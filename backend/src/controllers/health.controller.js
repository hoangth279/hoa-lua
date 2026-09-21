const healthCheck = (req, res) => {
    res.json({
        success: true,
        message: 'Hoa Lua API is running'
    });
};

module.exports = {
    healthCheck
};