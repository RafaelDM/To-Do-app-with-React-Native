#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>

#import <UMReactNativeAdapter/UMModuleRegistryAdapter.h>
#import <UMCore/UMAppDelegateWrapper.h>
//#import <EXUpdates/EXUpdatesAppController.h>

// @interface AppDelegate : UMAppDelegateWrapper <RCTBridgeDelegate, EXUpdatesAppControllerDelegate>

@interface AppDelegate : UMAppDelegateWrapper <RCTBridgeDelegate>

@property (nonatomic, strong) UMModuleRegistryAdapter *moduleRegistryAdapter;
@property (nonatomic, strong) UIWindow *window;

@end
