# node-tvm

An anonymous Token Vending Machine for AWS.

Provides two HTTP APIs:
- POST to `/registrations` with `device_id` and `key` body params to register a device.
- GET `/tokens` with `device_id`, `timestamp`, and `signature` query params; get temporary credentials back. The signature is a SHA256 HMAC hash of the timestamp using the key mentioned above.

## Usage

- Configure using environment variables. E.g., if running via [foreman](http://ddollar.github.io/foreman/), create a `.env` file like this:

```
AWS_ACCESS_KEY_ID=sdfsdf12313
AWS_SECRET_ACCESS_KEY=sdfsdf123123
TVM_REGION=us-west-1
TVM_TABLE=registrations
```

- `$ foreman start`
