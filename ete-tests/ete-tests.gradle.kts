import org.gradle.script.lang.kotlin.dependencies
import org.gradle.script.lang.kotlin.testCompile

buildscript {
    repositories {
        jcenter()
    }

    dependencies {
        val serenityVersion = "1.1.42"
        classpath("net.serenity-bdd:serenity-gradle-plugin:$serenityVersion")
    }
}

apply {

}

dependencies {
    testCompile("org.seleniumhq.selenium:selenium-firefox-driver:3.0.1")

    val serenityVersion = "1.1.42"
    testCompile("net.serenity-bdd:serenity-core:$serenityVersion")
    testCompile("net.serenity-bdd:serenity-junit:$serenityVersion")
    testCompile("net.serenity-bdd:serenity-screenplay:$serenityVersion")
    testCompile("net.serenity-bdd:serenity-screenplay-webdriver:$serenityVersion")

    testCompile("ch.qos.logback:logback-classic:1.1.7")
    testCompile("com.palantir.docker.compose:docker-compose-rule:0.28.1")
}