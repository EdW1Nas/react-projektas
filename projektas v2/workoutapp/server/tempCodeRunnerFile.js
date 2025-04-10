  //logout
  app.post('/logout', (req, res) =>{

    res.clearCookie('token', {
      httpOnly:true,
      sameSite:'lax',
      secure:false

    });
    res.json({message: 'logged out'});
  });