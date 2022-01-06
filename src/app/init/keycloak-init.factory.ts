import { KeycloakService } from "keycloak-angular";
import { from, lastValueFrom, switchMap } from "rxjs";
import { ConfigInitService } from "./config-init.service";

export function initializeKeycloak(
  keycloak: KeycloakService,
  configService: ConfigInitService
  ) {
    return async () => {
      const configuration$ = configService.getConfig()
        .pipe(
          switchMap<any,any>((config) => {
            return from(keycloak.init({
              config: {
                url: config['KEYCLOAK_URL'] + '/auth',
                realm: config['KEYCLOAK_REALM'],
                clientId: config['KEYCLOAK_CLIENT_ID'],
              },
              initOptions: {
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri:
                window.location.origin + '/assets/silent-check-sso.html'
              },
              bearerExcludedUrls: []
            }));
          })
        );
      
      await lastValueFrom(configuration$);
    }
}