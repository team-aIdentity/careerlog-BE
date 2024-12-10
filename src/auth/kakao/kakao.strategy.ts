import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    try {
      const { _json } = profile;
      const service_terms = await (
        await fetch(`	https://kapi.kakao.com/v2/user/service_terms`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).json();

      const marketing_term = service_terms.service_terms.find(
        (term) => term.tag === 'marketing_20241210',
      );
      const user = {
        providerUserId: _json.id,
        provider: 'kakao',
        email: _json.kakao_account.email,
        name: _json.kakao_account.name,
        birthDate: _json.kakao_account.birthyear + _json.kakao_account.birthday,
        phone: _json.kakao_account.phone_number || null,
        isMarketing: marketing_term ? true : false,
      };
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
