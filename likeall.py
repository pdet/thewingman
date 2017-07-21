import json
import sys

import wget

import tinder as ti
from facebooktoken import get_access_token


if __name__ == '__main__':

    credentials = json.load(open('credentials.json', 'r'))
    fb_id = credentials['FB_ID']
    fb_auth_token = get_access_token(credentials['FB_EMAIL_ADDRESS'], credentials['FB_PASSWORD'])

    print('FB_ID = {}'.format(fb_id))
    print('FB_AUTH_TOKEN = {}'.format(fb_auth_token))


    while True:
        token = ti.auth_token(fb_auth_token, fb_id)

        print('TINDER_TOKEN = {}'.format(token))

        if not token:
            print('could not get Tinder token. Program will exit.')
            sys.exit(0)

        print('Successfully connected to Tinder servers.')

        lat = 34.7
        lon = 135.5
        print(ti.change_loc(lat, lon, token))
        my_profile = ti.profile(token)
        print(json.dumps(my_profile, indent=4, sort_keys=True))

        for user in ti.recommendations(token,False):
            if not user:
                break
            print(' -> Like')
            match = ti.like(user.user_id)
            if match:
                print(' -> Match!')