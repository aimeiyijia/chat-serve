/**
 * 群名/用户名校验
 * @param name
 */
export function nameVerify(name: string): boolean {
  // 中文、字母、数字
  const nameReg = /^[\u4e00-\u9fa5|a-zA-Z0-9]+$/;
  if (name.length === 0) {
    return false;
  }
  if (!nameReg.test(name)) {
    return false;
  }
  return true;
}

/**
 * 密码校验
 * @param password
 */
export function passwordVerify(password: string): boolean {
  // 长度至少为8，至少含有一个字母和一个数字
  const passwordReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if (password.length === 0) {
    return false;
  }
  if (!passwordReg.test(password)) {
    return false;
  }
  if (password.length > 9) {
    return false;
  }
  return true;
}
