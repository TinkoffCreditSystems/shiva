import {
  CompilerOptions,
  Inject,
  Injectable,
  InjectFlags,
  InjectionToken,
  Injector,
  NgModuleRef,
  PlatformRef,
  Type,
} from '@angular/core';
import {defer, Observable, of} from 'rxjs';
import {Application, ApplicationConstructor} from '@tinkoff-shiva/core';
import {Router} from '@angular/router';
import {mapTo} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';

export const APP_NAME = new InjectionToken<string>('App name');
export const ROOT_SELECTOR = new InjectionToken<string>('Root selector');

// todo: очень грубая имплементация
function createAppFactory<M>(
  bootstrapFn: () => Promise<NgModuleRef<M>>,
  rootSelector: string,
  resolve: (value?: NgModuleRef<M> | PromiseLike<NgModuleRef<M>>) => void,
  reject: (reason?: any) => void,
): ApplicationConstructor {
  // todo: не хватает имплементации хуков, сообщений и навигации
  class AngularApp extends Application {
    private router: Router;
    private ngModule: NgModuleRef<M>;

    destroy() {
      super.destroy();

      if (this.ngModule) {
        this.ngModule.destroy();
        this.ngModule = null;
      }
    }

    bootstrap(container: string | Element, _props?: void) {
      container =
        typeof container === 'string' ? document.querySelector(container) : container;

      const rootElement = document.createElement(rootSelector);

      container.appendChild(rootElement);

      bootstrapFn()
        .then(ngModule => {
          this.ngModule = ngModule;
          this.router = ngModule.injector.get(Router, null, InjectFlags.Optional);

          super.bootstrap(container, _props);
          return ngModule;
        })
        .then(resolve, reject);
    }

    navigate(url: string, props: unknown | undefined): Observable<void> {
      if (this.router) {
        return defer(() => this.router.navigateByUrl(url)).pipe(mapTo(undefined));
      }

      return of(undefined);
    }

    //
    send(msg: string | MessageEvent): Observable<void> {
      return undefined;
    }
  }

  return AngularApp;
}

@Injectable()
export class ShivaPlatformRef extends PlatformRef {
  private document: Document;

  constructor(
    @Inject(DOCUMENT) document: any,
    @Inject(APP_NAME) private appName: string,
    @Inject(ROOT_SELECTOR) private rootSelector: string,
    _injector: Injector,
  ) {
    super();
    this.document = document;
    (this as any)._injector = _injector;
  }

  async bootstrapModule<M>(
    moduleType: Type<M>,
    compilerOptions?: CompilerOptions | Array<CompilerOptions>,
  ): Promise<NgModuleRef<M>> {
    const bootstrapFn = () => super.bootstrapModule(moduleType, compilerOptions);

    return new Promise((resolve, reject) => {
      // todo: тут нужно выкидывать event с конструктором,
      // а не создавать инстанс и бутстрапить
      const AppConstructor = createAppFactory(
        bootstrapFn,
        this.rootSelector,
        resolve,
        reject,
      );

      this.document.dispatchEvent(
        new CustomEvent('loadApp', {
          detail: {name: this.appName, appConstructor: AppConstructor},
        }),
      );
    });
  }
}
