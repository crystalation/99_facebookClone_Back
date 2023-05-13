const UserService = require('../services/users.service');

class UserController {
  userService = new UserService();

  signup = async (req, res) => {
    const { email, name, password, birthday, gender, file } = req.body;
    try {
      if (!email) {
        res.status(412).json({
          errorMessage: '이메일을 입력해 주십시오.',
        });
        return;
      }

      if (!name) {
        res.status(412).json({
          errorMessage: '이름을 입력해 주십시오.',
        });
        return;
      }

      if (!password) {
        res.status(412).json({
          errorMessage: '비밀번호를 입력해 주십시오.',
        });
        return;
      }

      if (!birthday) {
        res.status(412).json({
          errorMessage: '생년월일을 입력해 주십시오.',
        });
        return;
      }

      if (!gender) {
        res.status(412).json({
          errorMessage: '성별을 입력해 주십시오.',
        });
        return;
      }

      //body 데이터 입력 형식
      // console.log(new DATE(birthday));//"year, monthIndex, day"
      const birthDay = birthday.split(',');
      const year = Number(birthDay[0]);
      const monthIndex = Number(birthDay[1]);
      const day = Number(birthDay[2]);

      const dateObj = new Date(year, monthIndex, day);
      const formattedDate = dateObj.toLocaleDateString('ko-KR');

      //날짜는 해결해야함
      const signupData = await this.userService.signup({
        email,
        name,
        password,
        birthday: formattedDate,
        gender,
        file,
      });

      console.log(signupData);
      res.status(201).json({ message: '회원가입에 성공했습니다.', signupData });
    } catch (err) {
      console.error(err);
      res.status(400).json({
        errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
      });
    }
  };

  login = async (req, res) => {
    const { email, password } = req.body;
    const user = await this.userService.findOneUser(email);

    try {
      if (!user || password !== user.password) {
        res.status(412).json({
          errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
        });
        return;
      }

      //userData는 accessObject, refreshToken
      const userData = await this.userService.login(email);

      res.cookie(
        'Authorization',
        `${userData.accessObject.type} ${userData.accessObject.token}`
      );
      //Bearer, token 분리해서 가져옴

      res.cookie('refreshtoken', userData.refreshToken);
      res.status(200).json({
        Authorization: `${userData.accessObject.type} ${userData.accessObject.token}`,
        refreshtoken: userData.refreshToken,
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({
        errorMessage: '로그인에 실패하였습니다.',
      });
    }
  };
}

module.exports = UserController;
