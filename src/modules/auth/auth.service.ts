import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { GroupMap } from '../group/entity/group.entity';
import { nameVerify, passwordVerify } from 'src/common/tool/utils';
import { RCode, Roles } from 'src/common/constant';
import { omit } from 'src/common/tool/opera';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(GroupMap)
    private readonly groupUserRepository: Repository<GroupMap>,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: User): Promise<any> {
    // 判断下登录平台
    // 'customer': 客户端
    // 'server': 客服端
    const { role } = data;
    if (role === Roles.customer) {
      return await this.customerLogin(data);
    }
    // 如果是客服端登录
    if (role === Roles.server) {
      return await this.serverLogin(data);
    }
  }

  // 如果是客户端登录
  async customerLogin(data) {
    //首先查询是否已经注册过了
    const user = await this.userRepository.findOne({
      username: data.username,
      password: data.password,
    });
    // 注册过了就直接返回
    if (user) {
      const payload = {
        userId: user.userId,
      };
      return {
        msg: '登录成功',
        data: {
          user: omit(user, ['password']),
          token: this.jwtService.sign(payload),
        },
      };
    }

    // 没有注册过就去注册
    data.role = Roles.customer;
    data.avatar = `public/avatar/customer.png`;
    const newUser = await this.userRepository.save(data);
    const payload = {
      userId: newUser.userId,
    };
    return {
      msg: '注册并登录成功',
      data: {
        user: omit(newUser, ['password']),
        token: this.jwtService.sign(payload),
      },
    };
  }
  async serverLogin(data) {
    const user = await this.userRepository.findOne({
      username: data.username,
      password: data.password,
    });
    if (!user) {
      return { code: 1, msg: '密码错误', data: '' };
    }
    if (!passwordVerify(data.password) || !nameVerify(data.username)) {
      return { code: RCode.FAIL, msg: '注册校验不通过！', data: '' };
    }
    user.password = data.password;
    const payload = { userId: user.userId };
    return {
      msg: '登录成功',
      data: {
        user: user,
        token: this.jwtService.sign(payload),
      },
    };
  }

  async register(user: User): Promise<any> {
    const isHave = await this.userRepository.find({ username: user.username });
    if (isHave.length) {
      return { code: RCode.FAIL, msg: '用户名重复', data: '' };
    }
    const verifyFail = { code: RCode.FAIL, msg: '注册校验不通过！', data: '' };
    if (!passwordVerify(user.password)) {
      verifyFail.msg = "密码至少含有一个字母和一个数字且总长度不低于6";
      return verifyFail;
    }
    if (!nameVerify(user.username)) {
      verifyFail.msg = "用户名仅允许含有中文、字母、数字且总长度不低于1";
      return verifyFail;
    }
    user.avatar = `public/avatar/server.png`;
    user.role = 'server';
    const newUser = await this.userRepository.save(user);
    const payload = { userId: newUser.userId, password: newUser.password };
    return {
      msg: '注册成功',
      data: {
        user: newUser,
        token: this.jwtService.sign(payload),
      },
    };
  }
}
