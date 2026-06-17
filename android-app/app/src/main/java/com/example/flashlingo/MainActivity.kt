package com.example.flashlingo

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.enableEdgeToEdge
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        enableEdgeToEdge()

        // Make status bar transparent with dark background
        WindowCompat.setDecorFitsSystemWindows(window, false)
        window.statusBarColor = android.graphics.Color.parseColor("#121318")
        window.navigationBarColor = android.graphics.Color.parseColor("#121318")

        // Create WebView programmatically
        webView = WebView(this).apply {
            // Enable JavaScript
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true  // Required for localStorage
            settings.databaseEnabled = true
            settings.allowFileAccess = true
            settings.cacheMode = WebSettings.LOAD_DEFAULT
            settings.mediaPlaybackRequiresUserGesture = false

            // Fit content to screen width
            settings.useWideViewPort = true
            settings.loadWithOverviewMode = true

            // Enable zoom for accessibility
            settings.setSupportZoom(false)
            settings.builtInZoomControls = false

            // Modern rendering
            settings.mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW

            // Handle navigation within the WebView
            webViewClient = WebViewClient()
            webChromeClient = WebChromeClient()

            // Dark background to match the app
            setBackgroundColor(android.graphics.Color.parseColor("#121318"))
        }

        // Apply system bar and IME insets padding to resize when keyboard opens
        ViewCompat.setOnApplyWindowInsetsListener(webView) { view, insets ->
            val insetsType = WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.ime()
            val systemBarsAndIme = insets.getInsets(insetsType)
            view.setPadding(systemBarsAndIme.left, systemBarsAndIme.top, systemBarsAndIme.right, systemBarsAndIme.bottom)
            WindowInsetsCompat.CONSUMED
        }

        setContentView(webView)

        // Load local HTML file from assets
        webView.loadUrl("file:///android_asset/index.html")
    }

    // Handle back button for WebView navigation
    @Deprecated("Use OnBackPressedCallback instead")
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
