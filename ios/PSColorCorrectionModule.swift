//
//  PSColorCorrectionModule.swift
//  PSColorCorrectionModule
//
//  Copyright © 2022 Enes Hancer. All rights reserved.
//

import Foundation

@objc(PSColorCorrectionModule)
class PSColorCorrectionModule: NSObject {
  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    return ["count": 1]
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
