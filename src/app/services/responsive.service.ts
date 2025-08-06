import { Injectable } from "@angular/core"
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout"
import { Observable } from "rxjs"
import { map, shareReplay } from "rxjs/operators"

@Injectable({
  providedIn: "root",
})
export class ResponsiveService {
  isMobile$: Observable<boolean>
  isTablet$: Observable<boolean>
  isDesktop$: Observable<boolean>

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
      map((result) => result.matches),
      shareReplay(1),
    )

    this.isTablet$ = this.breakpointObserver.observe([Breakpoints.Tablet]).pipe(
      map((result) => result.matches),
      shareReplay(1),
    )

    this.isDesktop$ = this.breakpointObserver.observe([Breakpoints.Web]).pipe(
      map((result) => result.matches),
      shareReplay(1),
    )
  }
}
